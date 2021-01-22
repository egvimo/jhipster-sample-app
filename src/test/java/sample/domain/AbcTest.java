package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class AbcTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc.class);
        Abc abc1 = new Abc();
        abc1.setId(1L);
        Abc abc2 = new Abc();
        abc2.setId(abc1.getId());
        assertThat(abc1).isEqualTo(abc2);
        abc2.setId(2L);
        assertThat(abc1).isNotEqualTo(abc2);
        abc1.setId(null);
        assertThat(abc1).isNotEqualTo(abc2);
    }
}
