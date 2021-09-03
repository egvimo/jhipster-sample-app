package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class DefTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Def.class);
        Def def1 = new Def();
        def1.setId(1L);
        Def def2 = new Def();
        def2.setId(def1.getId());
        assertThat(def1).isEqualTo(def2);
        def2.setId(2L);
        assertThat(def1).isNotEqualTo(def2);
        def1.setId(null);
        assertThat(def1).isNotEqualTo(def2);
    }
}
